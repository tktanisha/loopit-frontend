export interface CategoryRequest {
    name:string,
    price:number,
    security:number
}

export interface GetCategoryResponse{
    id:number,
    name:string
    price:number
    security:number
}