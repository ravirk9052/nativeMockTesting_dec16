import React from "react";
import 'react-native';
import {it} from '@jest/globals';
import renderer from 'react-test-renderer';
import MainHeader from "../src/Screens/MainHeader";

it('renders when Main Header Screen comes', () => {
    const tree = renderer.create(<MainHeader />).toJSON();
    expect(tree).toBeDefined();
})