import { Department, Job } from "@/types/job";

export const MOCK_DEPARTMENTS: Department[] = [
  { id: "1", name: "Công nghệ thông tin", jobCount: 124 },
  { id: "2", name: "Kinh doanh", jobCount: 86 },
  { id: "3", name: "Marketing", jobCount: 42 },
  { id: "4", name: "Nhân sự", jobCount: 15 },
  { id: "5", name: "Kế toán", jobCount: 23 },
  { id: "6", name: "Thiết kế", jobCount: 38 },
];

export const MOCK_FEATURED_JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Java Developer",
    department: "Công nghệ thông tin",
    location: "Hà Nội",
    type: "Toàn thời gian",
    salary: "$1500 - $2500",
    postedAt: "2 giờ trước",
    isUrgent: true,
  },
  {
    id: "j2",
    title: "Frontend Developer (ReactJS)",
    department: "Công nghệ thông tin",
    location: "Hồ Chí Minh",
    type: "Toàn thời gian",
    salary: "$1000 - $1800",
    postedAt: "5 giờ trước",
  },
  {
    id: "j3",
    title: "Business Analyst",
    department: "Kinh doanh",
    location: "Hà Nội",
    type: "Toàn thời gian",
    salary: "$1200 - $2000",
    postedAt: "1 ngày trước",
  },
  {
    id: "j4",
    title: "UI/UX Designer",
    department: "Thiết kế",
    location: "Hồ Chí Minh",
    type: "Toàn thời gian",
    salary: "Thỏa thuận",
    postedAt: "2 ngày trước",
  },
  {
    id: "j5",
    title: "HR Specialist",
    department: "Nhân sự",
    location: "Đà Nẵng",
    type: "Toàn thời gian",
    salary: "$800 - $1200",
    postedAt: "3 ngày trước",
  },
  {
    id: "j6",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Hà Nội",
    type: "Toàn thời gian",
    salary: "$900 - $1500",
    postedAt: "1 tuần trước",
  },
];
