import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SmartHire home page', () => {
  render(<App />);
  expect(screen.getByText(/build better teams with less friction/i)).toBeInTheDocument();
});
