import { Application } from "express";
import { ControllerInterface } from "../../common/ControllerInterface";
import { ReviewRepositroy } from "./reviewRepository";
import { Validation } from "../../common/validation";
import { getValidation, insertVaidation, listingValidation, paramsValidation, updateValidation } from "./reviewValidation";
import { GetInterface, ListInterface } from "./reviewInterface";
import { protectReview, validateAccessToken } from "../../common/services/auth/authMiddleware";


export class ReviewController extends ControllerInterface {
    reviewRepository: ReviewRepositroy;
    constructor(app: Application) {
        super(app);
        this.reviewRepository = new ReviewRepositroy();
    }

    configureRoutes(): Application {
        
        this.app.get('/reviews/', 
            Validation(listingValidation), 
            async (req, res, next) => {
                try {
                    const options: ListInterface = req.query
                    const reviews = await this.reviewRepository.getReviews(options);
                    res.status(200).send({ data: reviews });
                } catch(err: any) {
                    next(err);
                }
        });


        this.app.get('/reviews/:id', 
            Validation(getValidation), 
            async (req, res, next) => {
                try {
                    const options: GetInterface = req.query;
                    const review = await this.reviewRepository.getReviewById(req.params.id, options);
                    res.status(200).send({ data: review });
                } catch(err: any) {
                    next(err);
                }
        });

        this.app.post('/reviews/', 
            validateAccessToken,
            protectReview,
            Validation(insertVaidation), 
            async (req, res, next) => {
                try {
                    const id = await this.reviewRepository.insertReview(req.body);
                    res.status(201).send({ data: { id }});
                } catch(err: any) {
                    next(err);
                }
        });

        this.app.delete('/reviews/:id', 
            validateAccessToken,
            protectReview,
            Validation(paramsValidation), 
            async (req, res, next) => {
                try {
                    await this.reviewRepository.deleteReview(req.params.id);
                    res.status(204).end();
                } catch(err: any) {
                    next(err);
                }
        });

        this.app.patch('/reviews/:id', 
            validateAccessToken,
            protectReview,
            Validation(updateValidation), 
            async (req, res, next) => {
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