import {body} from 'express-validator';

export const createExpenseValidator = [
  body('amount')
    .isFloat({gt: 0})
    .withMessage('Amount must be greater than 0'),

  body("paidBy")
    .notEmpty()
    .withMessage("Paid By is required"),
  
  body("participants")
    .isArray({min: 1})
    .withMessage("Participants must be an array with at least one element"),

  body("splitType")
    .isIn(['equal', 'percentage',"custom"])
    .withMessage("Split Type must be one of: equal, percentage, custom"),

  body("splitData")
    .custom((value, {req}) => {
        const {splitType,amount} = req.body;

        if (splitType === 'percentage') {
            const total = value.reduce((sum, v) => sum + Number(v.percent),  0);

            if (total !== 100) {
                throw new Error("Total percentage must be 100");
            }
        }
        if (splitType === 'custom') {
            const total = value.reduce((sum, curr) => sum + curr.amount, 0);    
            if (total !== amount) {
                throw new Error("Total custom amounts must equal the total expense amount");
            }
        }
        return true;
    })
];
