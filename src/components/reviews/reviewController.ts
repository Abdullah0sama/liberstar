import { Application } from "express";
import { ControllerInterface } from "../../common/ControllerInterface";
import { ReviewRepositroy } from "./reviewRepository";
import { Validation } from "../../common/validation";
import { insertVaidation, paramsValidation, updateValidation } from "./reviewValidation";


export class ReviewController extends ControllerInterface {
    reviewRepository: ReviewRepositroy;
    constructor(app: Application) {
        super(app);
        this.reviewRepository = new ReviewRepositroy();
    }

    configureRoutes(): Application {
        
        this.app.get('/reviews/', async (req, res, next) => {
            try {
                const reviews = await this.reviewRepository.getReviews();
                res.status(200).send({ data: reviews });
            } catch(err: any) {
                next(err);
            }
        });


        this.app.get('/reviews/:id', Validation(paramsValidation), async (req, res, next) => {
            try {
                const review = await this.reviewRepository.getReviewById(req.params.id);
                res.status(200).send({ data: review });
            } catch(err: any) {
                next(err);
            }
        });

        this.app.post('/reviews/', Validation(insertVaidation), async (req, res, next) => {
            try {
                const id = await this.reviewRepository.insertReview(req.body);
                res.status(201).send({ data: { id }});
            } catch(err: any) {
                next(err);
            }
        });

        this.app.delete('/reviews/:id', Validation(paramsValidation), async (req, res, next) => {
            try {
                await this.reviewRepository.deleteReview(req.params.id);
                res.status(204).end();
            } catch(err: any) {
                next(err);
            }
        });

        this.app.patch('/reviews/:id', Validation(updateValidation), async (req, res, next) => {
            try {
                await this.reviewRepository.updateReview(req.params.id, req.body);
                res.status(204).end();
            } catch(err: any) {
                next(err);
            }
        });

        return this.app;
    }
}