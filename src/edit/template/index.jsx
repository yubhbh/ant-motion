import React from 'react';
import NavController from './components/NavController';
import ContentController from './components/ContentController';
import EditStateController from './components/EditStateController';

import { getURLData } from '../../templates/template/utils';

import '../static/style';

const $ = window.$;


class Edit extends React.Component {
  constructor(props) {
    super(props);
    const urlData = this.getUrlData();
    this.state = {
      selectRect: null,
      enterRect: null,
      enterDom: null,
      urlData,
      urlHash: this.getHash(urlData),
      tabsKey: '1',
      editId: null,
      iframeHeight: null,
      scrollTop: 0,
    };
  }

  componentDidMount() {
    $('#preview').load(() => {
      this.setState({
        iframeHeight: $('#preview').contents().height(),
      }, () => {
        $('#preview').contents().find('body #react-content').mousemove((e) => {
          const dom = this.getByIdDom(e.target);
          if (dom !== this.state.enterDom) {
            if (this.state.enterDom) {
              $(this.state.enterDom).unbind('click', this.onClick);
            }
            dom.style.cursor = 'pointer';
            const jDom = $(dom);
            const rect = this.getRect(jDom);
            jDom.click(this.onClick);
            this.setState({ enterDom: dom, enterRect: rect });
          }
        });
        $('#preview').contents().find('body #react-content').mouseleave(() => {
          if (this.state.enterDom) {
            $(this.state.enterDom).unbind('click', this.onClick);
          }
          this.setState({ enterDom: null, enterRect: null });
        });
        $('#preview').contents().scroll(this.onScroll);
        $(window).resize(this.onResize);
      });
    });
  }

  onChangeTabs = (key) => {
    this.setState({
      tabsKey: key,
    });
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dom = e.currentTarget;
    const editId = dom.id;
    // const selectRect = dom.getBoundingClientRect();
    const rect = this.getRect($(dom));
    this.setState({ selectRect: rect, tabsKey: '2', editId });
  }

  onResize = () => {
    if (this.state.editId) {
      const dom = $('#preview').contents().find(`#${this.state.editId}`);
      if (dom.length) {
        const rect = this.getRect(dom);
        this.setState({ selectRect: rect });
      } else {
        this.selectHide = true;
      }
    }
  };

  onScroll = (e) => {
    const scrollTop = e.target.body.scrollTop || e.target.documentElement.scrollTop;
    const setState = { scrollTop };
    if (this.selectHide) {
      const dom = $('#preview').contents().find(`#${this.state.editId}`);
      if (dom.length) {
        this.selectHide = false;
        const rect = this.getRect(dom);
        setState.selectRect = rect;
      }
    }
    this.setState(setState);
  };

  setUrlData = (obj, reload) => {
    const urlData = this.state.urlData;
    Object.keys(obj).forEach((key) => {
      urlData[key] = obj[key];
    });

    const urlHash = this.getHash(urlData);
    this.setState({
      urlHash,
      urlData,
    }, () => {
      // 更改 url 后, 更新 selectRect;
      if (!reload) {
        const dom = $('#preview').contents().find(`#${this.state.editId}`);
        if (dom.length) {
          const selectRect = this.getRect(dom);
          this.setState({
            selectRect,
          });
        }
      } else {
        this.reloadIFrame();
      }
    });
  };

  getRect = dom => ({
    width: dom.outerWidth(),
    height: dom.outerHeight(),
    top: dom.offset().top,
    left: dom.offset().left,
  });

  getHash = (urlData) => {
    let urlHash = '';
    Object.keys(urlData).forEach((key) => {
      const mark = urlHash ? '&' : '#';
      const url = Array.isArray(urlData[key]) ?
        urlData[key].join(',') : JSON.stringify(urlData[key]);
      urlHash += `${mark}${encodeURIComponent(`${key}=${url}`)}`;
    });
    return urlHash;
  }

  getUrlData = () => {
    const tData = getURLData('t');
    const otherData = getURLData('o');
    const cData = getURLData('c');
    const urlData = {};
    if (tData) {
      urlData.t = tData.split(',');
    }
    if (otherData) {
      urlData.o = otherData.split(',');
    }
    if (cData) {
      urlData.c = JSON.parse(cData);
    }
    // window.location.hash = '';
    return urlData;
  };

  getByIdDom = (item) => {
    if (item.id) {
      return item;
    }
    return item.parentNode && this.getByIdDom(item.parentNode);
  };

  reloadIFrame = () => {
    $('#preview')[0].contentWindow.location.reload();
    this.setState({ selectRect: null, editId: null });
  }

  render() {
    return (<div>
      <NavController />
      <div className="edit-wrapper">
        <ContentController
          setUrlData={this.setUrlData}
          currentKey={this.state.tabsKey}
          onChangeTabs={this.onChangeTabs}
          editId={this.state.editId}
          urlData={this.state.urlData}
        />
        <div className="preview-container">
          <iframe id="preview" src={`/templates/${this.state.urlHash}`} />
        </div>
        <EditStateController
          enterRect={this.state.enterRect}
          selectRect={this.state.selectRect}
          scrollTop={this.state.scrollTop}
          height={this.state.iframeHeight}
        >
          {this.state.enterDom && this.state.enterDom.id}
        </EditStateController>
      </div>
    </div>);
  }
}

export default Edit;
