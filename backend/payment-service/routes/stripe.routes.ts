import { Router } from "express";
import {
    createPaymentIntent
} from "../controllers/stripe.controller";

const router = Router();

router.post("/", createPaymentIntent);

export default router;
