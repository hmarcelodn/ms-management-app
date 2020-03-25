// Framework
import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import * as jwt from "jsonwebtoken";
import * as CryptoJS from "crypto-js";
import * as PasswordValidator from "password-validator";

// Local
import { User } from "../entity/User";
import { LoginModel } from "../model/LoginModel";
import { TokenResponse } from "../model/TokenResponse";
import { CreateUserModel } from "../model/CreateUserModel";
import { ServiceCategory } from "../entity/ServiceCategory";
import { UserRepository } from "../repository/UserRepository";
import { UserCategoryModel } from "../model/UserCategoryModel";
import { ExternalLoginModel } from "../model/ExternalLoginModel";
import { GENERAL, MESSAGES, ERRORS } from "../insfrastructure/Constants";
import { ServiceCategoryRepository } from "../repository/ServiceCategoryRepository";
import { ExistingUserError } from "../entity/exception/ExistingUserError";
import { InvalidCategoryError } from "../entity/exception/InvalidCategoryError";

@Service()
export class UserService{

    async create(model: CreateUserModel): Promise<any>{
        const userRepository: UserRepository = getCustomRepository(UserRepository);

        if(!(await userRepository.getExistByEmailAddress(model.emailAddress.toLowerCase()))){
            let user: User = new User();
            let schema = new PasswordValidator();

            // Set Password Policy
            schema.is().min(8)
                  .is().max(25)
                  .has().uppercase()
                  .has().lowercase()
                  .has().digits()
                  .has().not().spaces();

            // Check Password Policy
            if(!schema.validate(model.password)){
                return {
                    status: "Invalid Password Policy. Include Uppercase/Lowercase/Digits/8-25 Characters."
                }
            }

            // Refactor using Factory Method
            user.setEmailAddress(model.emailAddress);
            user.setFirstName(model.firstName);
            user.setLastName(model.lastName);
            user.enable();
            user.setInternal();
    
            // AES Encription
            const encryptedPassword = CryptoJS.AES.encrypt(model.password, GENERAL.ENCRYPTION_KEY);    
            user.setPassword(encryptedPassword.toString());            
                
            await userRepository.save(user);

            return {
                status: MESSAGES.SUCESS
            }
        }
        else{
            throw new ExistingUserError(MESSAGES.EXISTING_USER);
        }
    }

    public async login(model: LoginModel): Promise<TokenResponse>{        
        const userRepository = getCustomRepository(UserRepository)
        const user: User = await userRepository.getByEmailAddress(model.email);

        if(!user){
            return new TokenResponse(null, false, MESSAGES.INVALID_CREDENTIALS);
        }
        
        if(!user.isEnabled()){
            return new TokenResponse(null, false, MESSAGES.BLACK_LIST_USER);
        }                

        // AES Decryption
        const decryptedIntendedPassword = CryptoJS.AES.decrypt(user.password, GENERAL.ENCRYPTION_KEY);
                
        if(model.password !== decryptedIntendedPassword.toString(CryptoJS.enc.Utf8)){
            user.sumAttemps();
            
            if(user.attemps === GENERAL.MAX_RETRY_LOGIN){
                user.disable();
            }

            await userRepository.save(user);
            
            return new TokenResponse(null, false, MESSAGES.INVALID_CREDENTIALS);
        }
        
        const payload = {
            email: user.emailAddress,
            uuid: user.id
        };
        
        let token:string = jwt.sign(payload, GENERAL.ENCRYPTION_KEY, {
            expiresIn: GENERAL.EXPIRATION_KEY
        });
        
        user.setCurrentToken(token);
                
        await userRepository.save(user);
        
        return new TokenResponse(token, true, MESSAGES.SUCESS);
    }

    async externalLogin(model: ExternalLoginModel, type: string):Promise<TokenResponse>{
        const repoUser = getCustomRepository(UserRepository);

        let instance_user: User = await repoUser.getExternalByEmailAddress(model.email, type);
        
        if(!instance_user){
            let instance = User.create();
            instance.enable();
            instance.setEmailAddress(model.email.toLowerCase());
            instance.setFirstName(model.firstName);
            instance.setLastName(model.lastName);
            instance.setPassword(null);         
            instance.setProvider(type);
            instance.picture = model.picture;

            instance_user = await repoUser.save(instance);
        }        

        const payload = {
            email: instance_user.emailAddress,
            uuid: instance_user.id
        };

        const token:string = jwt.sign(payload, GENERAL.ENCRYPTION_KEY, {
            expiresIn: GENERAL.EXPIRATION_KEY
        });

        instance_user.picture = model.picture;
        instance_user.setCurrentToken(token);
        
        await repoUser.save(instance_user);        

        return new TokenResponse(token, true, MESSAGES.SUCESS);
    }

    async addCategory(user: User, model: UserCategoryModel): Promise<void>{
        const repoUser = getCustomRepository(UserRepository);
        const repoServiceCategory = getCustomRepository(ServiceCategoryRepository);        
        const instanceServiceCategory = await repoServiceCategory.findOne(model.categoryGuid);

        if(!instanceServiceCategory){
            throw new InvalidCategoryError(ERRORS.INVALID_CATEGORY);
        }
        
        if(!user.categories){
            user.categories = new Array<ServiceCategory>();
        }

        user.categories.push(instanceServiceCategory);
        await repoUser.save(user);
    }
}