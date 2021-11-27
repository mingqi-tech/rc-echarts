/**
 * MIT License
 *
 *  Copyright (c) 2021 @mingqi/rc-echarts ranyunlong<549510622@qq.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, {
  createRef,
  forwardRef,
  HTMLProps,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { ECharts, EChartsCoreOption, init, use as _use } from 'echarts/core';
import { EChartsInitOpts } from '../../types';
import { addEvent } from '../../event';

export const RCEcharts = forwardRef<ECharts | undefined, RCEchartsProps>(
  (props, ref) => {
    const {
      option,
      theme,
      config,
      notMerge,
      autoResize = true,
      lazyUpdate,
      ...restProps
    } = props;
    const instance = useRef<ECharts>();
    const element = createRef<HTMLDivElement>();
    const rect = useRef<{ width: number; height: number }>();

    // 创建ref
    useImperativeHandle(ref, () => instance.current);

    // 创建实例
    useEffect(() => {
      if (!instance.current && element.current) {
        rect.current = {
          width: element.current.clientWidth,
          height: element.current.clientHeight,
        };
        instance.current = init(element.current, theme, config);
      }
    }, [element, theme, config]);

    // 监听option变化更新实例
    useEffect(() => {
      if (instance.current && option) {
        instance.current.setOption(option, notMerge, lazyUpdate);
      }
    }, [instance, option, notMerge, lazyUpdate]);

    // 监听dom变化
    useEffect(() => {
      if (autoResize) {
        const subscription = addEvent('resize', () => {
          if (
            rect.current &&
            element.current &&
            instance.current &&
            (rect.current.width !== element.current.clientWidth ||
              rect.current.width !== element.current.clientWidth)
          ) {
            instance.current.resize();
          }
        });
        return (): void => subscription.remove();
      }
    }, [element, rect, instance, autoResize]);

    return <div {...restProps} ref={element} />;
  }
);

export const use = _use;

export { EChartsCoreOption, ECharts } from 'echarts/core';

export interface RCEchartsProps extends HTMLProps<HTMLDivElement> {
  option?: EChartsCoreOption;
  theme?: string | object;
  config?: EChartsInitOpts;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  autoResize?: boolean;
}
