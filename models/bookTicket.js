const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus ID is required'],
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid Bus ID format'
    }
  },
  
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true,
    minlength: [2, 'Passenger name must be at least 2 characters'],
    maxlength: [100, 'Passenger name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Passenger name can only contain letters and spaces']
  },
  
  passengerEmail: {
    type: String,
    required: [true, 'Passenger email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    maxlength: [100, 'Email cannot exceed 100 characters']
  },
  
  passengerPhone: {
    type: String,
    required: [true, 'Passenger phone number is required'],
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'],
    validate: {
      validator: function(v) {
        // Remove all non-digits to check length
        const digitsOnly = v.replace(/\D/g, '');
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      message: 'Phone number must contain 10-15 digits'
    }
  },
  
  seatsBooked: {
    type: Number,
    required: [true, 'Number of seats booked is required'],
    min: [1, 'At least 1 seat must be booked'],
    max: [10, 'Cannot book more than 10 seats in a single booking'],
    validate: {
      validator: Number.isInteger,
      message: 'Seats booked must be a whole number'
    }
  },
  
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Total amount must be greater than 0'
    }
  },
  
  bookingDate: {
    type: String,
    required: [true, 'Booking date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Booking date must be in YYYY-MM-DD format'],
    default: function() {
      return new Date().toISOString().split('T')[0];
    }
  },
  
  status: {
    type: String,
    required: [true, 'Booking status is required'],
    enum: {
      values: ['confirmed', 'pending', 'cancelled', 'completed', 'refunded'],
      message: 'Status must be one of: confirmed, pending, cancelled, completed, refunded'
    },
    default: 'confirmed'
  },
  
  // Additional useful fields
  bookingReference: {
    type: String,
    unique: true,
    default: function() {
      return 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    }
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash'],
    default: 'credit_card'
  },
  
  seatNumbers: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= this.seatsBooked;
      },
      message: 'Seat numbers cannot exceed seats booked'
    }
  },
  
  journeyDate: {
    type: Date,
    required: [true, 'Journey date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Journey date cannot be in the past'
    }
  },
  
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  
  refundAmount: {
    type: Number,
    default: 0,
    min: [0, 'Refund amount cannot be negative'],
    validate: {
      validator: function(v) {
        return v <= this.totalAmount;
      },
      message: 'Refund amount cannot exceed total amount paid'
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Book  = mongoose.model("Book",bookingSchema,"book");
module.exports = Book;