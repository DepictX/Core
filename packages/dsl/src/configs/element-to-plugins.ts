import { FlexPlugin } from '@depict-plugins/flex';
import { InlinePlugin } from '@depict-plugins/inline';
import { TextPlugin } from '@depict-plugins/text';
import { ViewPlugin } from '@depict-plugins/view';
import { Plugin } from '@depict-x/core';

import {
  Flex, View, Text, Inline, 
} from '../dsl';
import { IElementType } from '../interfaces';

export const ElementToPlugin = new Map<IElementType, typeof Plugin>();

ElementToPlugin.set(Flex, FlexPlugin);
ElementToPlugin.set(View, ViewPlugin);
ElementToPlugin.set(Text, TextPlugin);
ElementToPlugin.set(Inline, InlinePlugin);
