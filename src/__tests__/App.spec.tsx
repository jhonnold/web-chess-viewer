import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

describe('<App />', (): void => {
    it('should render a header', () => {
        const { getByText } = render(<App />);

        expect(getByText('React Minimal Boilerplate')).toBeInTheDocument();
    });

    it('should start at 0', () => {
        const { getByRole } = render(<App />);

        expect(getByRole('button')).toHaveTextContent('Total clicks: 0');
    });

    it('should go up by 1 on click', () => {
        const { getByRole } = render(<App />);

        fireEvent.click(getByRole('button'));
        expect(getByRole('button')).toHaveTextContent('Total clicks: 1');
    });
});
