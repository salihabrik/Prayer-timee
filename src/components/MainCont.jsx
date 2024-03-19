import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./PrayerTime";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainCont() {
  const [locationPermission, setLocationPermission] = useState(false);
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
      displayName: "الجزائر العاصمة",
      apiName: "dz",
  });

  const [today, setToday] = useState("");

  const avilableCities = [
    {
      displayName: "الجزائر العاصمة",
      apiName: "dz",
    },
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
    {
      displayName: "الجزائر العاصمة",
      apiName: "dz",
    },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  const getTimings = async () => {
    const response = await axios.get(
      `http://api.aladhan.com/v1/timingsByCity?country=dz&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  // Function to fetch prayer times based on geolocation
  const fetchPrayerTimesByLocation = async (latitude, longitude) => {
    const fullDate = moment().format("DD-MM-YYYY");
    try {
      const response = await axios.get(
        `http://api.aladhan.com/v1/timings/${fullDate}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      setTimings(response.data.data.timings);
      setSelectedCity(latitude);
    } catch (error) {
      console.error("Error getting prayer times by location:", error);
    }
  };

  // Handler for the "Get My Location" button
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimesByLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocationPermission(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
      setLocationPermission(false);
    }
  };

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log("the new value is ", event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <>
      {/* TOP ROW */}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{selectedCity.displayName}</h1>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/*== TOP ROW ==*/}

      <Divider style={{ borderColor: "white", opacity: "0.1" }} />

      {/* PRAYERS CARDS */}
      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          image="https://wepik.com/api/image/local/141600588/9b98d7a3-7bff-497a-be90-ac9bb78445b2?expires=1710907200&thumb=1&transparent=0&signature=6036f5c6f7ae0c94dd7c7b2f7425a8d495d071e293100805d7eec16aee7aae52"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          image="https://wepik.com/api/image/local/141600588/9b98d795-4036-4e6b-8583-e589eb5c6a3f?expires=1710907200&thumb=1&transparent=0&signature=4f7a43c389cc90d3e94093a62f79bd759d50ec215a10df354afe75b1f27168c5"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image="https://wepik.com/api/image/local/141600588/9b98d936-5261-4532-9847-c0ead310d980?expires=1710907200&thumb=1&transparent=0&signature=4754db8597fc32dd1c368a756f3cd2ec311a7b35f8c4537c8deab4f182ceae1b"
        />
        <Prayer
          name="المغرب"
          time={timings.Sunset}
          image="https://wepik.com/api/image/local/141600588/9b98d79e-f1aa-4bd8-828b-50842da7b954?expires=1710907200&thumb=1&transparent=0&signature=a69ba8b8633e7ef935574bbf205760c204533cd4c152d99541289c1e1088c307"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image="https://wepik.com/api/image/local/141600588/9b98d78f-a450-4d67-ad28-eb383b87a72f?expires=1710907200&thumb=1&transparent=0&signature=aa6739e56b66b572aead5a787194100986bdd4484ee34b149fc68e9b78816a3d"
        />
      </Stack>
      {/*== PRAYERS CARDS ==*/}

      {/* SELECT CITY */}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "20px" }}
      >
        <Button variant="contained" onClick={handleGetLocation}>
          Get My Location
        </Button>
      </Stack>
    </>
  );
}
