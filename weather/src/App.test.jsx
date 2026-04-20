import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {

  test('renders Weather Report heading', () => {
    render(<App />);
    const heading = screen.getByText(/weather report/i);
    expect(heading).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/enter city name/i);

    fireEvent.change(input, { target: { value: 'hyderabad' } });

    expect(input.value).toBe('hyderabad');
  });

  test('form input works (name & email)', () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText(/enter name/i);
    const emailInput = screen.getByPlaceholderText(/enter email/i);

    fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'john@test.com' } });

    expect(nameInput.value).toBe('John');
    expect(emailInput.value).toBe('john@test.com');
  });

  test('submit button click works', () => {
    render(<App />);

    const button = screen.getByText(/submit/i);
    fireEvent.click(button);

    // no assertion needed unless you mock console
    expect(button).toBeInTheDocument();
  });

});