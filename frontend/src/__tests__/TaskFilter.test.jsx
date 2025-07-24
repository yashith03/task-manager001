import React from 'react';


import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilter from '../components/TaskFilter';

describe('🧪 TaskFilter', () => {
  it('renders filter buttons and handles change', () => {
    const mockSetFilter = jest.fn();
    render(<TaskFilter filter="All" setFilter={mockSetFilter} />);

    const allBtn = screen.getByRole('button', { name: /All/i });
    fireEvent.click(allBtn);
    expect(mockSetFilter).toHaveBeenCalledWith('All');
  });
});
