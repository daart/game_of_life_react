import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

export const Controls = ({ reset, tick, next, pause }) => (
  <div>
    <Button content="Pause" icon="pause" labelPosition="left" onClick={pause} />
    <Button content="Next" icon="right arrow" labelPosition="left" onClick={next}/>
    <Button content="Auto" icon="sync" labelPosition="left" onClick={tick}/>
    <Button content="Reset" icon="undo" labelPosition="left" onClick={reset}/>
  </div>
);
