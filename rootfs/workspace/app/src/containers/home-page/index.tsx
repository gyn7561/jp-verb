import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { message } from 'antd';
import Start from '../../components/start';
import Practice from '../../components/practice';
import Result from '../../components/result';
import { Dispatch } from '../../store'
import { Entity, Answers, FormDataType } from '../../components/types'

const mapDispatch = (dispatch: Dispatch) => ({
  async genQuestion(data: FormDataType): Promise<Entity[]> {
    let ret = await dispatch.words.randomAsync(data)
    return ret
  }
})

type Props = ReturnType<typeof mapDispatch>;
type State = {
  page: number;
  conjugations: number[];
  entities: Entity[];
  answers: Answers;
}
const initState: State = {
    page: 0,
    conjugations: [],
    entities: [],
    answers: {},
}
class HomePage extends React.PureComponent<Props, State> {
  state = initState;

  handleStart = async (data: FormDataType) => {
    try {
      console.log('start:', data)
      let entities = await this.props.genQuestion(data)
      this.setState({page: 1, entities, conjugations: data.conjugations})
    } catch (error) {
      console.error('fetch word', error)
      message.warn('服务器出错，请稍候再试。')
    }
  }
  handleSubmit = (answers: Answers) => {
    this.setState({page: 2, answers})
  }
  startPractice = () => {
    this.setState({page: 1})
  }
  reset = () => {
    this.setState(initState)
  }

  render() {
    if (this.state.page === 0) {
      return (<Start onSubmit={this.handleStart} />)
    }

    if (this.state.page === 1) {
      return (
        <Practice
          entities={this.state.entities}
          conjugations={this.state.conjugations}
          goBack={this.reset}
          onSubmit={this.handleSubmit}
        />
      )
    }

    return (
      <Result
        entities={this.state.entities}
        conjugations={this.state.conjugations}
        answers={this.state.answers}
        goBack={this.reset}
        onAgainClick={this.startPractice}
      />
    )
  }
}

export default compose<Props, State>(
  connect(null, mapDispatch)
)(HomePage);
