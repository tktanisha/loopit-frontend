
export interface Feedback{
   
	id: number
	given_by:number
    given_to:number
	text:string
	rating:number
	created_at: string

}


export interface FeedbackRequest{
    order_id:number
	feedback_text:string
	rating:number
}

