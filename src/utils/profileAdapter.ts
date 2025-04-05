
import { Profile } from '@/types/supabase';

export type ProfileData = {
  name: string;
  dateOfBirth: Date | undefined;
  gender: string;
  category: string;
  email: string;
  phone: string;
  educationLevel: string;
  course: string;
  board: string;
  yearOfStudy: string;
  marks: string;
  familyIncome: string;
  parentsOccupation: string;
  state: string;
  district: string;
  pincode: string;
  isDisabled: boolean;
  isOrphan: boolean;
  hasSingleParent: boolean;
};

export function convertSupabaseProfileToFormData(profile: Profile | null): ProfileData | undefined {
  if (!profile) return undefined;
  
  return {
    name: profile.name || '',
    dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
    gender: profile.gender || '',
    category: profile.category || '',
    email: profile.email || '',
    phone: profile.phone || '',
    educationLevel: profile.education_level || '',
    course: profile.course || '',
    board: profile.board || '',
    yearOfStudy: profile.year_of_study || '',
    marks: profile.marks || '',
    familyIncome: profile.family_income || '',
    parentsOccupation: profile.parents_occupation || '',
    state: profile.state || '',
    district: profile.district || '',
    pincode: profile.pincode || '',
    isDisabled: profile.is_disabled || false,
    isOrphan: profile.is_orphan || false,
    hasSingleParent: profile.has_single_parent || false,
  };
}

export function convertFormDataToSupabaseProfile(formData: ProfileData, userId: string): Partial<Profile> {
  return {
    id: userId,
    name: formData.name,
    date_of_birth: formData.dateOfBirth?.toISOString(),
    gender: formData.gender,
    category: formData.category,
    email: formData.email,
    phone: formData.phone,
    education_level: formData.educationLevel,
    course: formData.course,
    board: formData.board,
    year_of_study: formData.yearOfStudy,
    marks: formData.marks,
    family_income: formData.familyIncome,
    parents_occupation: formData.parentsOccupation,
    state: formData.state,
    district: formData.district,
    pincode: formData.pincode,
    is_disabled: formData.isDisabled,
    is_orphan: formData.isOrphan,
    has_single_parent: formData.hasSingleParent
  };
}
