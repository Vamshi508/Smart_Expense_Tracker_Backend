import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    amount: { type: Number},
    description: { type: String},
    date: { type: Date, default: Date.now },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    splits:[
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            share: { type: Number }
        }
    ],

    category: { type: String  } ,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Expense', expenseSchema);