
import { ScholarshipProps } from '../components/ScholarshipCard';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

export const mockScholarships: ScholarshipProps[] = [
  {
    id: "1",
    title: "National Merit Scholarship",
    provider: "National Merit Scholarship Corporation",
    amount: "$2,500",
    deadline: "October 15, 2025",
    eligibility: ["High School", "3.8+ GPA", "U.S. Citizen"],
    description: "The National Merit Scholarship Program is an academic competition for recognition and scholarships that began in 1955. High school students enter the program by taking the PSAT/NMSQT.",
    url: "https://example.com/scholarship1"
  },
  {
    id: "2",
    title: "Coca-Cola Scholars Program",
    provider: "The Coca-Cola Company",
    amount: "$20,000",
    deadline: "August 31, 2025",
    eligibility: ["High School", "Leadership", "Community Service"],
    description: "The Coca-Cola Scholars Program scholarship is an achievement-based scholarship awarded to graduating high school seniors. Students are recognized for their capacity to lead and serve, as well as their commitment to making a significant impact on their schools and communities.",
    url: "https://example.com/scholarship2"
  },
  {
    id: "3",
    title: "Dell Scholars Program",
    provider: "Michael & Susan Dell Foundation",
    amount: "$20,000",
    deadline: "December 1, 2025",
    eligibility: ["Financial Need", "2.4+ GPA", "Undergraduate"],
    description: "The Dell Scholars Program is a scholarship and college completion program that recognizes students who have overcome significant obstacles to pursue their educations.",
    url: "https://example.com/scholarship3"
  },
  {
    id: "4",
    title: "Gates Scholarship",
    provider: "Bill & Melinda Gates Foundation",
    amount: "Full Tuition",
    deadline: "September 15, 2025",
    eligibility: ["Minority", "3.3+ GPA", "Pell Grant Eligible"],
    description: "The Gates Scholarship is a highly selective, full scholarship for exceptional, Pell-eligible, minority, high school seniors. The scholarship will be awarded to 300 top student leaders each year with the intent of promoting their academic excellence.",
    url: "https://example.com/scholarship4"
  },
  {
    id: "5",
    title: "Women in STEM Scholarship",
    provider: "Society of Women Engineers",
    amount: "$5,000",
    deadline: "February 15, 2026",
    eligibility: ["Female", "Engineering", "Computer Science"],
    description: "The Women in STEM Scholarship supports female students pursuing degrees in science, technology, engineering, and mathematics fields to promote gender diversity in these industries.",
    url: "https://example.com/scholarship5"
  },
  {
    id: "6",
    title: "Hispanic Heritage Foundation Youth Awards",
    provider: "Hispanic Heritage Foundation",
    amount: "$3,500",
    deadline: "November 30, 2025",
    eligibility: ["Hispanic/Latino", "3.0+ GPA", "Community Service"],
    description: "The Youth Awards honors Latino high school seniors who excel in the classroom and community and for their excellence in various categories including Business & Entrepreneurship, Community Service, Education, Engineering, Healthcare & Science, Media & Entertainment, and Technology.",
    url: "https://example.com/scholarship6"
  },
  {
    id: "7",
    title: "Jack Kent Cooke Foundation Scholarship",
    provider: "Jack Kent Cooke Foundation",
    amount: "$55,000",
    deadline: "October 30, 2025",
    eligibility: ["Financial Need", "3.5+ GPA", "Graduate"],
    description: "The Jack Kent Cooke Foundation College Scholarship Program is an undergraduate scholarship program available to high-achieving high school seniors with financial need who seek to attend the nation's best four-year colleges and universities.",
    url: "https://example.com/scholarship7"
  },
  {
    id: "8",
    title: "Thurgood Marshall College Fund",
    provider: "Thurgood Marshall College Fund",
    amount: "$4,700",
    deadline: "May 31, 2026",
    eligibility: ["HBCU Student", "3.0+ GPA", "Financial Need"],
    description: "The Thurgood Marshall College Fund provides scholarships exclusively to students attending Historically Black Colleges and Universities (HBCUs) and Predominantly Black Institutions (PBIs).",
    url: "https://example.com/scholarship8"
  },
  {
    id: "9",
    title: "American Indian College Fund",
    provider: "American Indian College Fund",
    amount: "$6,000",
    deadline: "May 31, 2026",
    eligibility: ["Native American", "2.0+ GPA", "Undergraduate"],
    description: "The American Indian College Fund provides scholarships to American Indian and Alaska Native college students seeking undergraduate and graduate degrees at tribal colleges, nonprofit colleges, and universities.",
    url: "https://example.com/scholarship9"
  }
];

// Function to seed the database with mock scholarships
export const seedScholarships = async () => {
  try {
    // Check if scholarships already exist in the database
    const { data: existingScholarships, error: checkError } = await supabase
      .from('scholarships')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking for existing scholarships:', checkError);
      return;
    }
    
    // If scholarships already exist, don't add again
    if (existingScholarships && existingScholarships.length > 0) {
      console.log('Scholarships already seeded');
      return;
    }
    
    // Prepare the data for insertion
    const scholarshipsToInsert = mockScholarships.map(scholarship => ({
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      eligibility: scholarship.eligibility,
      description: scholarship.description,
      url: scholarship.url
    }));
    
    // Insert scholarships into database
    const { error: insertError } = await supabase
      .from<keyof Database['public']['Tables'], any>('scholarships')
      .insert(scholarshipsToInsert);
      
    if (insertError) {
      console.error('Error seeding scholarships:', insertError);
      return;
    }
    
    console.log('Successfully seeded scholarships');
  } catch (error) {
    console.error('Unexpected error seeding scholarships:', error);
  }
};
