use borsh::{BorshDeserialize, BorshSerialize};

#[derive(Debug, PartialEq)]
pub enum ExpressionError {
    DivideByZero,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulo,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ExpressionCalculator {
    pub a: f64,
    pub b: f64,
    pub op: Operation,
}

impl ExpressionCalculator {
    pub fn evaluate(&self) -> Result<f64, ExpressionError> {
        match self.op {
            Operation::Add => Ok(self.a + self.b),
            Operation::Subtract => Ok(self.a - self.b),
            Operation::Multiply => Ok(self.a * self.b),
            Operation::Divide => {
                if self.b == 0.0 {
                    Err(ExpressionError::DivideByZero)
                } else {
                    Ok(self.a / self.b)
                }
            }
            Operation::Modulo => {
                if self.b == 0.0 {
                    Err(ExpressionError::DivideByZero)
                } else {
                    Ok(self.a % self.b)
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let expr_calc = ExpressionCalculator {
            a: 1.0,
            b: 2.0,
            op: Operation::Add,
        };

        assert_eq!(expr_calc.evaluate(), Ok(3.0));
    }

    #[test]
    fn test_subtract() {
        let expr_calc = ExpressionCalculator {
            a: 5.0,
            b: 3.5,
            op: Operation::Subtract,
        };

        assert_eq!(expr_calc.evaluate(), Ok(1.5));
    }

    #[test]
    fn test_multiply() {
        let expr_calc = ExpressionCalculator {
            a: 1.2,
            b: 5.0,
            op: Operation::Multiply,
        };

        assert_eq!(expr_calc.evaluate(), Ok(6.0));
    }

    #[test]
    fn test_divide() {
        let expr_calc = ExpressionCalculator {
            a: 7.0,
            b: 2.0,
            op: Operation::Divide,
        };

        assert_eq!(expr_calc.evaluate(), Ok(3.5));
    }

    #[test]
    fn test_divide_by_zero() {
        let expr_calc = ExpressionCalculator {
            a: 7.0,
            b: 0.0,
            op: Operation::Divide,
        };

        assert_eq!(expr_calc.evaluate(), Err(ExpressionError::DivideByZero));
    }

    #[test]
    fn test_modulo() {
        let expr_calc = ExpressionCalculator {
            a: 7.0,
            b: 2.0,
            op: Operation::Modulo,
        };

        assert_eq!(expr_calc.evaluate(), Ok(1.0));
    }

    #[test]
    fn test_modulo_by_zero() {
        let expr_calc = ExpressionCalculator {
            a: 7.0,
            b: 0.0,
            op: Operation::Modulo,
        };

        assert_eq!(expr_calc.evaluate(), Err(ExpressionError::DivideByZero));
    }
}
