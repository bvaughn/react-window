import React, { Component, Fragment } from 'react';

import './ComponentApi.css';

type Method = {|
  description: string,
  signature: string,
|};

type Prop = {|
  defaultValue?: any,
  description: React$Node,
  isRequired?: boolean,
  name: string,
  type: string,
|};

type Props = {|
  name: string,
  methods: Array<Method>,
  methodsIntro?: React$Node,
  props: Array<Prop>,
  propsIntro?: React$Node,
|};
type State = {|
  showAll: boolean,
|};

export default class ComponentApi extends Component<Props, State> {
  state = {
    showAll: true,
  };

  render() {
    const { name, methods, methodsIntro, props, propsIntro } = this.props;
    const { showAll } = this.state;

    const hasOptionalProps = props.some(prop => !prop.isRequired);

    return (
      <div className="ComponentApi">
        <div className="ComponentApiContent">
          <h1 className="ComponentApiHeader">&lt;{name}&gt;</h1>
          <h2 id="props" className="ComponentApiSubHeader">
            Props
            {hasOptionalProps && (
              <small>
                <label className="ComponentApiRadioToggle">
                  <input
                    type="radio"
                    value={true}
                    checked={this.state.showAll}
                    onChange={this.toggleShowAll}
                  />{' '}
                  All
                </label>
                <label className="ComponentApiRadioToggle">
                  <input
                    type="radio"
                    value={false}
                    checked={!this.state.showAll}
                    onChange={this.toggleShowAll}
                  />{' '}
                  Required
                </label>
              </small>
            )}
          </h2>
          {propsIntro}
          <dl className="ComponentApiPropList">
            {props.filter(prop => showAll || prop.isRequired).map(prop => (
              <Fragment key={prop.name}>
                <dt className="ComponentApiPropType">
                  {prop.name}: {prop.type}{' '}
                  {prop.defaultValue !== undefined
                    ? ` = ${prop.defaultValue}`
                    : null}
                </dt>
                <dd className="ComponentApiPropDefinition">
                  {prop.description}
                </dd>
              </Fragment>
            ))}
          </dl>
          <h2 id="methods" className="ComponentApiSubHeader">
            Methods
          </h2>
          {methodsIntro}
          <dl>
            {methods.map(method => (
              <Fragment key={method.signature}>
                <dt className="ComponentApiPropType">{method.signature}</dt>
                <dd className="ComponentApiPropDefinition">
                  {method.description}
                </dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  toggleShowAll = () =>
    this.setState((prevState: State) => ({
      showAll: !prevState.showAll,
    }));
}
