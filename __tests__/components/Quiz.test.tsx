import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from '@/components/study/Quiz';

const mockQuestions = [
  {
    question: 'What is TypeScript?',
    options: ['A language', 'A framework', 'A database', 'A protocol'],
    correctAnswer: 'A language',
    explanation: 'TypeScript is a typed superset of JavaScript.',
  },
  {
    question: 'What is Next.js?',
    options: ['React framework', 'CSS library', 'Database', 'Testing tool'],
    correctAnswer: 'React framework',
    explanation: 'Next.js is a React framework for production.',
  },
];

describe('Quiz Component', () => {
  it('renders nothing when no questions provided', () => {
    const { container } = render(<Quiz questions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the first question', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('What is TypeScript?')).toBeInTheDocument();
  });

  it('renders all 4 options as buttons', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('A language')).toBeInTheDocument();
    expect(screen.getByText('A framework')).toBeInTheDocument();
    expect(screen.getByText('A database')).toBeInTheDocument();
    expect(screen.getByText('A protocol')).toBeInTheDocument();
  });

  it('shows feedback after selecting an answer', () => {
    render(<Quiz questions={mockQuestions} />);
    fireEvent.click(screen.getByText('A language'));
    expect(screen.getByText('Brilliant!')).toBeInTheDocument();
    expect(screen.getByText('TypeScript is a typed superset of JavaScript.')).toBeInTheDocument();
  });

  it('shows incorrect feedback for wrong answer', () => {
    render(<Quiz questions={mockQuestions} />);
    fireEvent.click(screen.getByText('A framework'));
    expect(screen.getByText('Not quite.')).toBeInTheDocument();
  });

  it('advances to next question after clicking Next', () => {
    render(<Quiz questions={mockQuestions} />);
    fireEvent.click(screen.getByText('A language'));
    fireEvent.click(screen.getByText('Next Question'));
    expect(screen.getByText('What is Next.js?')).toBeInTheDocument();
  });

  it('shows final score after completing all questions', () => {
    render(<Quiz questions={mockQuestions} />);
    
    // Answer Q1
    fireEvent.click(screen.getByText('A language'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Answer Q2
    fireEvent.click(screen.getByText('React framework'));
    fireEvent.click(screen.getByText('Next Question'));
    
    expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
    expect(screen.getByText(/2 out of 2/)).toBeInTheDocument();
  });

  it('allows retaking the quiz', () => {
    render(<Quiz questions={mockQuestions} />);
    
    // Complete quiz
    fireEvent.click(screen.getByText('A language'));
    fireEvent.click(screen.getByText('Next Question'));
    fireEvent.click(screen.getByText('React framework'));
    fireEvent.click(screen.getByText('Next Question'));
    
    // Retake
    fireEvent.click(screen.getByText('Retake Quiz'));
    expect(screen.getByText('What is TypeScript?')).toBeInTheDocument();
  });

  it('displays progress bar', () => {
    render(<Quiz questions={mockQuestions} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('displays question counter with accessible text', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('of 2')).toBeInTheDocument();
  });
});
