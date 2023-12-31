import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import Toggle from "react-styled-toggle";
import axios from "axios";

import { Button, LoadingState } from "_atoms";
import { Gallery, Showroom, Table } from "_molecules";
import { Section, Hero } from "_organisms";

import { theme } from "_theme/theme";

import { CarWrapper, TableWrapper } from "./main-page.styles";

import { ERGAST_URL, F1_FLAG_URL } from "_api/api";

const MainPage = () => {
  const [driverInfo, setDriverInfo] = useState({});
  const [carInfo, setCarInfo] = useState({});
  const [tableInfo, setTableInfo] = useState({});
  const [tableName, setTableName] = useState("prost");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${F1_FLAG_URL}/drivers`).then((response) => {
      setDriverInfo(response.data);
    });
  }, [setDriverInfo]);

  useEffect(() => {
    axios.get(`${F1_FLAG_URL}/car`).then((response) => {
      setCarInfo(response.data);
    });
  }, [setCarInfo]);

  useEffect(() => {
    axios
      .get(`${ERGAST_URL}/1989/drivers/${tableName}/results.json`)
      .then((response) => {
        setTableInfo(response.data.MRData.RaceTable.Races);
        setLoading(false);
      });
  }, [tableName]);

  const onChangeHandle = (e) => {
    setLoading(true);
    setTableName((prevValue) => (prevValue === "senna" ? "prost" : "senna"));
  };

  return (
    <React.Fragment>
      <Hero />
      {carInfo.length && (
        <Section
          variant="dark"
          preset="text-first"
          id={carInfo[0].id}
          title={carInfo[1].name}
          text={carInfo[2].description}
        >
          <CarWrapper>
            <Canvas shadows>
              <Showroom />
            </Canvas>
          </CarWrapper>
        </Section>
      )}
      {driverInfo.length &&
        driverInfo.map((driver, index) => {
          const { images, name, bio } = driver;

          const options = {};

          switch (name) {
            case "Alain Prost":
              options.variant = "light";
              options.preset = "text-second";
              break;
            default:
              options.variant = "dark";
              options.preset = "text-first";
              break;
          }

          return (
            <Section {...options} id={name} title={name} text={bio} key={index}>
              <Gallery images={images} name={name} />
            </Section>
          );
        })}
      {tableInfo.length && (
        <Section
          variant="light"
          preset="column"
          id="Championship"
          title="1989 Championship"
        >
          <Toggle
            backgroundColorUnchecked={theme.colors.darkGrey}
            backgroundColorChecked={theme.colors.darkGrey}
            labelLeft="Alain Prost"
            labelRight="Ayrton Senna"
            onChange={onChangeHandle}
          />
          <TableWrapper>
            <Table preset="ProstVsSenna" info={tableInfo}></Table>
            {loading && <LoadingState pageType="main" />}
          </TableWrapper>
          <Link to="/other-results">
            <Button preset="primary">CHECK OTHER RESULTS</Button>
          </Link>
        </Section>
      )}
    </React.Fragment>
  );
};
export default MainPage;
