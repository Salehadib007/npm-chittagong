import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { formatDate } from "../../../utils/formatDate";

/* keep your InfoCard + Section unchanged */

const EnrollmentProfileView = () => {
  const { enrollmentId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        // using _id from QR
        const res = await api.get(`/enrollment/${enrollmentId}`);
        log(res.data);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [enrollmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Enrollment not found
      </div>
    );
  }

  return <div>{/* keep ALL your existing UI below exactly as-is */}</div>;
};

export default EnrollmentProfileView;
