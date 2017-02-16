import React from 'react';
import { Link } from 'react-router';
import H2 from '../components/H2';
import Tagline from '../components/Tagline';

export default () => (<div>
    <header>
        <H2 colour="green">404</H2>
        <Tagline>Getting off track? <Link href="/">Home</Link></Tagline>
    </header>
</div>);
