import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const SVGComponent = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 15 15" fill="#fff" {...props}>
    <Path d="M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z" />
  </Svg>
);
export default SVGComponent;
