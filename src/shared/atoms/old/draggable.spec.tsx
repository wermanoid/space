import React from 'react';
import { render } from '@testing-library/react';

import Draggable from './draggable';

describe('sample', () => {
  it('should', () => {
    const { container } = render(
      <Draggable id="324" render="div">
        work
      </Draggable>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('draggable', 'true');
    expect(container.firstChild).toHaveTextContent('work');
  });
});
