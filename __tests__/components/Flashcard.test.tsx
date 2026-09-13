import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Flashcard from '@/components/study/Flashcard';

describe('Flashcard Component', () => {
  const defaultProps = {
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces.',
  };

  it('renders the question on the front face', () => {
    render(<Flashcard {...defaultProps} />);
    expect(screen.getByText('What is React?')).toBeInTheDocument();
  });

  it('renders the answer on the back face', () => {
    render(<Flashcard {...defaultProps} />);
    expect(screen.getByText('A JavaScript library for building user interfaces.')).toBeInTheDocument();
  });

  it('has a "Tap to flip" hint', () => {
    render(<Flashcard {...defaultProps} />);
    expect(screen.getByText('Tap to flip')).toBeInTheDocument();
  });

  it('toggles flip state on click', () => {
    render(<Flashcard {...defaultProps} />);
    const card = screen.getByRole('button');
    
    // Initially not flipped
    expect(card.querySelector('[style*="preserve-3d"]')).not.toHaveClass('rotate-y-180');
    
    // Click to flip
    fireEvent.click(card);
    
    // Should now be flipped
    const inner = card.querySelector('[style*="preserve-3d"]');
    expect(inner?.className).toContain('rotate-y-180');
  });

  it('is accessible with proper role and label', () => {
    render(<Flashcard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label');
  });
});
