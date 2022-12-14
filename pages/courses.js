import { Button, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MainLayout from '../components/mainLayout';
import style from '../styles/courses.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  postBlueClick,
  postCreateCourse,
  getCoursesByUsername,
  postSearchCourse,
  postJoinCourse,
} from '../util';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import Flow from './flow';
import urlMonitor from '../utils/urlMonitor';
import React from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  height: '30vh',
  bgcolor: 'white !important',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function Courses() {
  const router = useRouter();

  const [createCourseName, setCreateCourseName] = useState('');
  const [courses, setCourses] = useState([]);
  const [searchInfo, setSearchInfo] = useState('');
  const [showModal, setModal] = useState(false);
  const [courseToJoin, setCourseToJoin] = useState(null);

  const getAllCourses = async () => {
    let courses = await getCoursesByUsername();
    setCourses(courses);
  };

  // fetch the courses when loaded
  useEffect(() => {
    getAllCourses();
  }, []);

  async function addNewCourse() {
    setTimeout(async () => {
      const res = await postCreateCourse({
        courseName: createCourseName,
      });
      if (res) {
        getAllCourses();
      }
    }, 3000);
  }

  async function clickSearch() {
    const res = await postSearchCourse({
      courseName: searchInfo,
      username: localStorage.getItem('username'),
    });
    if (res.course) {
      if (res.jump) {
        let course = courses.find((item) => {
          return item.courseName === searchInfo;
        });
        router.push({
          pathname: '/courseDetail',
          query: { category: course.category, courseName: course.courseName },
        });
      } else {
        setModal(true);
        setCourseToJoin(res.course);
      }
    }
  }

  React.useEffect(() => {
    urlMonitor();
  }, []);

  return (
    <MainLayout>
      <Modal
        open={showModal}
        onClose={() => {}}
        aria-labelledby='modal-modal-title'
      >
        <Box sx={modalStyle}>
          <Stack direction='row' spacing={10}>
            <Stack alignItems='center'>
              <Typography
                id='modal-modal-title'
                variant='h5'
                component='h2'
                sx={{ marginBottom: '30px' }}
              >
                Project
              </Typography>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
                sx={{ color: 'rgba(16, 16, 16, 0.41) !important' }}
              >
                {courseToJoin && courseToJoin.courseName}
              </Typography>
            </Stack>

            <Stack alignItems='center'>
              <Typography
                id='modal-modal-title'
                variant='h5'
                component='h2'
                sx={{ marginBottom: '30px' }}
              >
                Owner
              </Typography>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
                sx={{ color: 'rgba(16, 16, 16, 0.41) !important' }}
              >
                {courseToJoin && courseToJoin.teacherName}
              </Typography>
            </Stack>

            <Button
              id='J-Join'
              sx={{
                color: '#96C99F !important',
                fontSize: '20px',
              }}
              onClick={async () => {
                const _ = await postJoinCourse({
                  courseName: courseToJoin.courseName,
                });
                if (_.res) {
                  setModal(false);
                  getAllCourses();
                }
              }}
            >
              Join
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          marginBottom: '30px',
        }}
      >
        <Typography
          variant='h2'
          sx={{ fontSize: '26px !important', fontWeight: '700' }}
        >
          <span className='title-green'>Create a New Project</span>
        </Typography>
        <TextField
          id='C-Projectname'
          label='Project Name'
          sx={{ marginTop: '30px', width: '60%', marginBottom: '50px' }}
          onChange={(event) => {
            setCreateCourseName(event.target.value);
          }}
        ></TextField>
        <Button
          id='C-Submit'
          className={style.button}
          variant='outlined'
          sx={{ width: '300px', height: '50px' }}
          onClick={() => {
            addNewCourse();
          }}
        >
          Submit!
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <h1 className='index-title title-green'>All Projects</h1>
        <Box
          sx={{
            width: '1200px',
            marginTop: '40px',
            padding: '20px',
            border: '5px solid #87CC9B',
            borderRadius: '2%',
            marginBottom: '20px',
          }}
        >
          <Stack>
            <div className={style.row}>
              <div
                className={
                  style.rowFirst + ' ' + style.rowHead + ' ' + 'title-green'
                }
              >
                Projects
              </div>
              <div
                className={
                  style.rowSecond + ' ' + style.rowHead + ' ' + 'title-green'
                }
              >
                Option
              </div>
            </div>
            {courses.map((item) => (
              <div key={item.courseName} className={style.row}>
                <Link
                  passHref
                  href={{
                    pathname: '/courseDetail',
                    query: {
                      category: item.category,
                      courseName: item.courseName,
                    },
                  }}
                >
                  <div
                    id='CC-Projectname'
                    className={style.rowFirst + ' ' + style.rowContent}
                    style={{ color: 'blue' }}
                  >
                    {item.courseName}
                  </div>
                </Link>
                <a
                  className={`${style.rowSecond} ${style.rowContent}`}
                  style={{ color: '#3291f8 !important' }}
                >
                  <div
                    className={style.link}
                    id='pCourses-Status'
                    onClick={() => {
                      postBlueClick('pCourses-Status');
                    }}
                  >
                    {item.category == 'teach' ? 'Manage' : 'Contribute'}
                  </div>
                </a>
              </div>
            ))}
          </Stack>
        </Box>

        <Stack
          direction='row'
          spacing={4}
          sx={{ margin: '20px', marginTop: '0px' }}
        >
          <TextField
            id='SRCH-input'
            sx={{ width: '80vw' }}
            onChange={(event) => {
              setSearchInfo(event.target.value);
            }}
          ></TextField>
          <Button
            id='SRCH-Yes'
            className={style.button}
            variant='outlined'
            onClick={() => {
              clickSearch();
            }}
          >
            Yes
          </Button>
        </Stack>
      </Box>
    </MainLayout>
  );
}
