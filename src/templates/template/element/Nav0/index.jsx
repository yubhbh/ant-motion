import React, { PropTypes } from 'react';
import TweenOne from 'rc-tween-one';
import Menu from 'antd/lib/menu';
import './index.less';

const Item = Menu.Item;

class Header extends React.Component {
  render() {
    const dataSource = this.props.dataSource;
    const props = { ...this.props };
    delete props.dataSource;
    const names = props.id.split('_');
    const name = `${names[0]}${names[1]}`;
    return (<TweenOne
      component="header"
      animation={{ opacity: 0, type: 'from' }}
      {...props}
      style={dataSource[name].style || {}}
    >
      <TweenOne
        className={`${this.props.className}-logo`}
        animation={{ x: -30, type: 'from', ease: 'easeOutQuad' }}
        id={`${this.props.id}-logo`}
        style={dataSource[`${name}_logo`].style || {}}
      >
        <img height="33" src={dataSource[`${name}_logo`].children} />
      </TweenOne>
      <TweenOne
        className={`${this.props.className}-nav`}
        animation={{ x: 30, type: 'from', ease: 'easeOutQuad' }}
      >
        <Menu
          mode="horizontal" defaultSelectedKeys={['a']}
          style={dataSource[`${name}_menu`].style || {}}
          id={`${this.props.id}-menu`}
        >
          <Item key="a">
            {dataSource[`${name}_menu`].children.menu1}
          </Item>
          <Item key="b">
            {dataSource[`${name}_menu`].children.menu2}
          </Item>
          <Item key="c">
            {dataSource[`${name}_menu`].children.menu3}
          </Item>
          <Item key="d">
            {dataSource[`${name}_menu`].children.menu4}
          </Item>
        </Menu>
      </TweenOne>
    </TweenOne>);
  }
}

Header.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.object,
  id: PropTypes.string,
};

Header.defaultProps = {
  className: 'header0',
};

export default Header;
