import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Vibration,
  SafeAreaView,
} from "react-native";
import PropTypes from "prop-types";

const Timer = ({ minute, second }) => (
  <Text style={styles.timer}>
    {("0" + minute).slice(-2)}:{("0" + second).slice(-2)}
  </Text>
);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      displayminutes: 0,
      displayseconds: 0,
      totalseconds: 5,
      breaktotalseconds: 5,
      workminutes: 0,
      workseconds: 5,
      breakminutes: 0,
      breakseconds: 5,
      timerOn: false,
      intervalId: 0,
      breakOn: false,
    };
  }

  static propTypes = {};

  componentDidMount() {
    this.startCountDown();
  }

  startCountDown = () => {
    if (
      this.state.totalseconds >= 0 &&
      this.state.breakOn === false &&
      this.state.timerOn === true
    ) {
      let IntervalId = setInterval(this.workcountDown, 1000);
      this.setState((state) => ({ intervalId: IntervalId }));
    }

    if (
      this.state.breaktotalseconds >= 0 &&
      this.state.breakOn === true &&
      this.state.timerOn === true
    ) {
      let IntervalId = setInterval(this.breakcountDown, 1000);
      this.setState((state) => ({ intervalId: IntervalId }));
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  breakcountDown = () => {
    if (this.state.breaktotalseconds >= 0) {
      this.setState((state) => ({
        displayminutes: Math.floor(this.state.breaktotalseconds / 60),
      }));

      this.setState((state) => ({
        displayseconds: this.state.breaktotalseconds % 60,
      }));
      this.setState((state) => ({
        breaktotalseconds: state.breaktotalseconds - 1,
      }));
    } else {
      clearInterval(this.state.intervalId);
      this.setState((state) => ({ breakOn: false }));
      this.setState((state) => ({ breaktotalseconds: state.breakseconds }));
      Vibration.vibrate(5000);
      this.startCountDown();
    }
  };

  workcountDown = () => {
    if (this.state.totalseconds >= 0) {
      this.setState((state) => ({
        displayminutes: Math.floor(this.state.totalseconds / 60),
      }));
      this.setState((state) => ({
        displayseconds: this.state.totalseconds % 60,
      }));
      this.setState((state) => ({ totalseconds: state.totalseconds - 1 }));
    } else {
      clearInterval(this.state.intervalId);
      this.setState((state) => ({ breakOn: true }));
      this.setState((state) => ({ totalseconds: state.workseconds }));
      Vibration.vibrate(5000);
      this.startCountDown();
    }
  };

  onChange = (inputName, inputValue) => {
    const num = Number.parseInt(inputValue);
    console.log(num);
    if (Number.isNaN(num)) {
      this.setState((state) => ({ ...state, [inputName]: 0 }));
    } else if (num > 60) {
      this.setState((state) => ({ ...state, [inputName]: 60 }));
    } else {
      this.setState((state) => ({ ...state, [inputName]: num }));
    }
  };

  async start() {
    await this.setState({ timerOn: true });
    this.startCountDown();
  }

  stop() {
    this.setState((state) => ({ timerOn: false }));
    clearInterval(this.state.intervalId);
  }

  reset() {
    this.setState((state) => ({
      totalseconds: state.workminutes * 60 + state.workseconds,
    }));
    this.setState((state) => ({
      breaktotalseconds: state.breakminutes * 60 + state.breakseconds,
    }));
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#854E81" }}>
        <View style={styles.container}>
          <Text style={styles.timer}>
            {this.state.breakOn ? "Break Timer" : "Work Timer"}
          </Text>
          <Timer
            minute={this.state.displayminutes}
            second={this.state.displayseconds}
          />
          <View style={styles.rowAlign}>
            <TouchableOpacity
              style={styles.button}
              onPress={
                this.state.timerOn === false
                  ? () => this.start()
                  : () => this.stop()
              }
            >
              <Text>{this.state.timerOn === false ? "Start" : "Pause"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.reset()}
            >
              <Text>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowAlign}>
            <Text style={styles.text}>Work Time</Text>
            <Text style={styles.text}>Mins:</Text>
            <TextInput
              style={styles.textInput}
              value={String(this.state.workminutes)}
              keyboardType="numbers-and-punctuation"
              returnKeyType="go"
              onChangeText={(value) => this.onChange("workminutes", value)}
            />
            <Text style={styles.text}>Secs:</Text>
            <TextInput
              style={styles.textInput}
              value={String(this.state.workseconds)}
              keyboardType="numbers-and-punctuation"
              returnKeyType="go"
              onChangeText={(value) => this.onChange("workseconds", value)}
            />
          </View>
          <View style={[styles.rowAlign, styles.padTop]}>
            <Text style={styles.text}>Break Time</Text>
            <Text style={styles.text}>Mins:</Text>
            <TextInput
              style={styles.textInput}
              value={String(this.state.breakminutes)}
              keyboardType="numbers-and-punctuation"
              returnKeyType="go"
              onChangeText={(value) => this.onChange("breakminutes", value)}
            />
            <Text style={styles.text}>Secs:</Text>
            <TextInput
              style={styles.textInput}
              value={String(this.state.breakseconds)}
              keyboardType="numbers-and-punctuation"
              returnKeyType="go"
              onChangeText={(value) => this.onChange("breakseconds", value)}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE3FD",
    color: "#854E81",
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 50,
    color: "#854E81",
  },
  colorButton: {
    backgroundColor: "#802A17",
    color: "#802A17",
  },
  rowAlign: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
  },
  alignRight: {
    alignItems: "center",
  },
  padTop: {
    paddingTop: 20,
  },
  text: {
    color: "#854E81",
    padding: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  padRight: {
    paddingRight: 20,
  },
  padBottom: {
    paddingBottom: 20,
  },
  textInput: {
    height: 30,
    width: 50,
    borderWidth: 4,
    borderColor: "#CC78C6",
    borderRadius: 10,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#CC78C6",
    padding: 10,
    margin: 10,
  },
});
