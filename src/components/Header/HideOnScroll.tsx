import React from 'react';
import Slide from '@material-ui/core/Slide/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger/useScrollTrigger';

interface Props {
  children: React.ReactElement;
}

export default function HideOnScroll({ children }: Props) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
