import { Response } from 'express';

export function handleError(res: Response, err: Error) {
  console.error('Error:', err);
  res.status(500).json({
    error: {
      message: 'An error occurred while fetching data',
      meta: { err },
    },
  });
}
