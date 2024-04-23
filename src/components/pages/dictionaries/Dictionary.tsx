'use client';

import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import { BreadCrumb } from '@components/common';
import { useTranslate } from '@app/hooks';

import { IngredientsDictionary } from './ingredients';
import { OrderSources } from './order-source';
const Dictionary = props => {
  const t = useTranslate('COMP_Dictionary');
  const [customHoverTab, setCustomHoverTab] = useState<{ id: string; title: string }>({
    id: '1',
    title: t('INGREDIENTS_TITLE'),
  });

  const tabs = [
    {
      id: '1',
      title: t('INGREDIENTS_TITLE'),
      icon: <i className="ri-file-list-3-line d-block fs-20 mb-1" />,
      comp: <IngredientsDictionary propertyId={props.ingredientPropertyId} />,
    },
    {
      id: '2',
      title: t('ORDER_SOURCE_TITLE'),
      icon: <i className="ri-base-station-line d-block fs-20 mb-1" />,
      comp: <OrderSources propertyId={props.orderSourcePropertyId} />,
    },
  ];

  const customHoverToggle = tab => {
    if (customHoverTab !== tab) {
      setCustomHoverTab({
        id: tab.id,
        title: tab.title,
      });
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb
        title={customHoverTab.title}
        paths={[
          { label: t('LOOKUPS_TITLE'), relativePath: '', isActive: true },
          { label: customHoverTab.title, relativePath: '', isActive: true },
        ]}
      />
      <Card>
        <CardBody>
          <Row>
            <Col lg={2}>
              <Nav pills className="nav nav-pills flex-column nav-pills-tab custom-verti-nav-pills text-center">
                {tabs.map(elem => (
                  <NavItem key={'prod-tab-' + elem.id}>
                    <NavLink
                      style={{ cursor: 'pointer' }}
                      className={classnames({ 'mb-2': true, active: customHoverTab.id === elem.id })}
                      onClick={() => {
                        customHoverToggle(elem);
                      }}
                    >
                      {elem.icon}
                      {elem.title}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Col>
            <Col lg={10}>
              <TabContent activeTab={customHoverTab.id} className="text-muted mt-3 mt-lg-0">
                {tabs.map(elem => (
                  <TabPane key={'prod-tab-pane-' + elem.id} tabId={elem.id}>
                    {elem.comp}
                  </TabPane>
                ))}
              </TabContent>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
export default Dictionary;
