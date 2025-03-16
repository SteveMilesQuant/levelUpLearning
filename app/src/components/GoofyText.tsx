import { ReactNode } from "react";
import { ResponsiveValue, Text, useBreakpointValue } from "@chakra-ui/react";
import { Property } from "csstype";

interface Props {
    fontSize?: ResponsiveValue<number>;
    transform?: ResponsiveValue<string>;
    textAlign?: ResponsiveValue<Property.TextAlign>;
    children?: ReactNode;
}

const GoofyText = ({ fontSize, transform, textAlign, children }: Props) => {
    const outlineSize = useBreakpointValue({ base: 0.6, lg: 1.2 });
    const cssString = `-webkit-text-stroke: ${outlineSize}px rgb(4,0,154);`;
    return (
        <Text
            fontFamily="om-botak"
            fontSize={fontSize} textColor="brand.tertiary"
            transform={transform}
            textAlign={textAlign ? textAlign : "center"}
            css={cssString}
        >
            {children}
        </ Text>
    )
}

export default GoofyText