/// <reference types="vite/client" />

declare module '*.svg' {
    import * as React from 'react';
    export const SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}