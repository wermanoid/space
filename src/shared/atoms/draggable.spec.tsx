import React from 'react';
import { mount } from 'enzyme';

import Draggable from './draggable';

describe('sample', () => {
  it('sjoudl', () => {
    const wrap = mount(
      <Draggable id="324" render="div">
        work
      </Draggable>
    );
    expect(wrap).toMatchSnapshot();
  });
});
