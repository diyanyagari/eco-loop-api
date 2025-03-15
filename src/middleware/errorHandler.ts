import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    // Return a standardized message without exposing sensitive details
    res.status(err.status || 500).json({
        success: false,
        message: 'An error occurred. Please try again later.',
    });
};
