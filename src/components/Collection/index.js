import React from 'react'
import Banner from '../Artist/Banner'
import { Container } from 'react-bootstrap'
import "../../styles/Collection.css"
import { Link } from 'react-router-dom'
import ArtOne from "../../assets/collections/bdss\ 1.png";
import ArtTWo from "../../assets/collections/Charcoal-Sketch\ 1.png"
import ArtThree from "../../assets/collections/ertrc\ 1.png"

function Collections() {
  return (
    <div>
      <Banner></Banner>
      <Container fluid className='sectionOne'>
        <button className='ArtOne'>Painting</button>  
      </Container>
      <div className='artistContainer' >
        <Container fluid className='section-four'>

          <div className='row artist' >

            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtOne} className="collectionOne"></img>


              </Link>
            </div>






            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtTWo} className="collectionTwo"></img>
              </Link>
            </div>




            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtThree} className="collectionThree"></img>
              </Link>
            </div>

          </div>
        </Container>
        <Container fluid className='section-four'>

          <div className='row artist' >
            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtOne} className="collectionOne"></img>
              </Link>
            </div>
            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtTWo} className="collectionTwo"></img>
              </Link>
            </div>
            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtThree} className="collectionThree"></img>
              </Link>
            </div>
          </div>
        </Container>

        <Container fluid className='section-four'>

          <div className='row artist' >
            <div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtOne} className="collectionOne"></img>

              </Link>
            </div><div className='col-lg-4'>
              <Link to="/art/1234">

                <img src={ArtTWo} className="collectionTwo"></img>


              </Link>
            </div><div className='col-lg-4'>
              <Link to="/art/1234">
                <img src={ArtThree} className="collectionThree"></img>
              </Link>
            </div>
          </div>
        </Container>
      </div>

    </div>
  )
}

export default Collections