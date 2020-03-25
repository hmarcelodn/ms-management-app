// Framework
import { Service } from "typedi";
import { getCustomRepository } from "typeorm";

// Services
import { ServiceCategoryRepository } from "../repository/ServiceCategoryRepository";
import { ServiceCategory } from "../entity/ServiceCategory";

@Service()
export class InitializerService{

    private _serviceCategoryRepository: ServiceCategoryRepository;

    constructor(){
        this._serviceCategoryRepository = getCustomRepository(ServiceCategoryRepository);
    }

    async initializeCategories(){
        console.log("Initialize Categories.");
        const categories = new Array<ServiceCategory>();
        categories.push(
            ServiceCategory.instance("Peluquería", null),
            ServiceCategory.instance("Tareas del Hogar", null)
        )
        this.saveCategories(categories);
    }

    private async saveCategories(categories: Array<ServiceCategory>){
        // Validate & Persist
        categories.map(async (category, index) => {
            if(!await this._serviceCategoryRepository.getByName(category.name)){
                await this._serviceCategoryRepository.save(category);
            }
        });
    }

}