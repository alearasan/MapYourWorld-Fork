    import { Router } from "express";
    import {
        getActiveSubscription,
        createSubscription,
        updateSubscription,
        getSubscriptionById,
        deleteSubscription
    } from "../controllers/subscription.controller";

    const router = Router();

    router.get("/active/:userId", getActiveSubscription);
    router.post("/", createSubscription);
    router.put("/:id", updateSubscription);
    router.get("/:id", getSubscriptionById);
    router.delete("/:subscriptionId", deleteSubscription);

    export default router;
