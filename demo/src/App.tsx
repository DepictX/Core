import { Engine, createEffect, createSignal } from 'engine';
import { Flex, View, Text, Inline } from 'layout';
import { Renderer, View as ViewModule } from 'renderer';
import { Layout } from 'layout';
import { DepictX as TestX, RenderExtensionId } from '@depict-x/core';

function TestClassComponent({ text }) {
  const [count, setCount] = createSignal(0);

  const getCountWithStr = () => {
    return "count: " + count() + '; text: ' + text();
  }

  // createEffect(() => {
  //   console.log(getCountWithStr());
  // });

  setInterval(() => {
    setCount(count() + 1);
  }, 1000);

  (window).setCount = setCount;

  return (<Flex><View><Text content={getCountWithStr} /></View></Flex>)
}

export function App(props) {
  const [show, setShow] = createSignal(true);
  const [color, setColor] = createSignal('#00f');
  const [text, setText] = createSignal('props text');
  const [list, setList] = createSignal([1, 2, 3, 4, 5, 6, 7, 8, 10]);
  const __DEBUG__ = !!1;
  window.setShow = setShow;
  window.setText = setText;
  window.setList = setList;
  window.setColor = setColor;
  return (
    <View>
      <Flex gap={50} flexWrap='wrap'>
        <View style={{ color: () => color() }}>{__DEBUG__ ? (<TestClassComponent text={text} />) : null}</View>
        {() => show() && props.children}
        {() => list().map((_, index) => {
          return <View><Text content={String(index)} /></View>;
        })}
      </Flex>
      {() => list().map((_, index) => (
        <View>
          <Inline>
            <Text content={`ABCDEFGHIJKLMNOPQRSTUVWXYZqwertyuioplkjhgfdsazxcvbnm${index + 1}`} />
            <Text content={`xxxxxxxxxxxxxxx${index + 1}`} />
          </Inline>
        </View>
      ))}
    </View>
  );
}


const engine = new Engine();

engine.use(new Layout());
engine.use(new ViewModule());

const canvas = document.querySelector('#canvas');
window.engine = engine;

engine.render(<App><View><Text content='abc' /></View></App>, canvas);

const depictX = new TestX();
depictX.register(Renderer, { container: canvas })