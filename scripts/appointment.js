// Appointment page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        // Add error message elements to form groups
        const formGroups = appointmentForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            if (!group.querySelector('.error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                group.appendChild(errorDiv);
            }
        });

        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Custom validation for appointment form
            if (!validateAppointmentForm()) {
                return;
            }

            // Get form data
            const formData = new FormData(appointmentForm);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = appointmentForm.querySelector('.submit-btn');
            const resetLoading = window.showLoading(submitBtn);

            // Simulate API call
            setTimeout(() => {
                resetLoading();
                
                // Show success message
                window.showSuccessMessage(
                    'Your appointment request has been submitted successfully! We will contact you within 24 hours to confirm your appointment.',
                    appointmentForm.querySelector('.form-header')
                );

                // Reset form
                appointmentForm.reset();
                
                // Remove validation classes
                formGroups.forEach(group => {
                    group.classList.remove('success', 'error');
                });

                console.log('Appointment form submitted:', data);
            }, 2500);
        });

        // Custom validation for appointment form
        function validateAppointmentForm() {
            let isValid = true;
            const requiredFields = appointmentForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');

                if (!field.value.trim() && field.type !== 'radio') {
                    formGroup.classList.add('error');
                    formGroup.classList.remove('success');
                    if (errorMessage) {
                        errorMessage.textContent = 'This field is required';
                    }
                    isValid = false;
                } else if (field.value.trim()) {
                    formGroup.classList.remove('error');
                    formGroup.classList.add('success');
                }
            });

            // Check radio buttons
            const visitTypeRadios = appointmentForm.querySelectorAll('input[name="visitType"]');
            const visitTypeChecked = Array.from(visitTypeRadios).some(radio => radio.checked);
            const visitTypeGroup = visitTypeRadios[0].closest('.form-group');
            const visitTypeError = visitTypeGroup.querySelector('.error-message');

            if (!visitTypeChecked) {
                visitTypeGroup.classList.add('error');
                if (visitTypeError) {
                    visitTypeError.textContent = 'Please select a visit type';
                }
                isValid = false;
            } else {
                visitTypeGroup.classList.remove('error');
                visitTypeGroup.classList.add('success');
            }

            // Check terms checkbox
            const termsCheckbox = appointmentForm.querySelector('input[name="terms"]');
            const termsGroup = termsCheckbox.closest('.checkbox-group');
            
            if (!termsCheckbox.checked) {
                termsGroup.style.color = '#e53e3e';
                isValid = false;
            } else {
                termsGroup.style.color = '';
            }

            // Date validation (not in the past)
            const appointmentDate = appointmentForm.querySelector('#appointmentDate');
            if (appointmentDate && appointmentDate.value) {
                const selectedDate = new Date(appointmentDate.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    const dateGroup = appointmentDate.closest('.form-group');
                    const dateError = dateGroup.querySelector('.error-message');
                    dateGroup.classList.add('error');
                    if (dateError) {
                        dateError.textContent = 'Please select a future date';
                    }
                    isValid = false;
                }
            }

            // Age validation (must be reasonable)
            const dateOfBirth = appointmentForm.querySelector('#dateOfBirth');
            if (dateOfBirth && dateOfBirth.value) {
                const birthDate = new Date(dateOfBirth.value);
                const today = new Date();
                const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

                if (age < 0 || age > 120) {
                    const dobGroup = dateOfBirth.closest('.form-group');
                    const dobError = dobGroup.querySelector('.error-message');
                    dobGroup.classList.add('error');
                    if (dobError) {
                        dobError.textContent = 'Please enter a valid date of birth';
                    }
                    isValid = false;
                }
            }

            return isValid;
        }

        // Real-time validation
        const inputs = appointmentForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const formGroup = this.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');

                if (this.hasAttribute('required') && !this.value.trim() && this.type !== 'radio') {
                    formGroup.classList.add('error');
                    formGroup.classList.remove('success');
                    if (errorMessage) {
                        errorMessage.textContent = 'This field is required';
                    }
                } else if (this.type === 'email' && this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        formGroup.classList.add('error');
                        formGroup.classList.remove('success');
                        if (errorMessage) {
                            errorMessage.textContent = 'Please enter a valid email address';
                        }
                    } else {
                        formGroup.classList.remove('error');
                        formGroup.classList.add('success');
                    }
                } else if (this.value.trim()) {
                    formGroup.classList.remove('error');
                    formGroup.classList.add('success');
                }
            });

            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup.classList.contains('error') && this.value.trim()) {
                    formGroup.classList.remove('error');
                }
            });
        });

        // Department change handler - update doctor options
        const departmentSelect = document.getElementById('department');
        const doctorSelect = document.getElementById('doctor');
        
        if (departmentSelect && doctorSelect) {
            const doctorsByDepartment = {
                'cardiology': [
                    { value: 'dr-johnson', text: 'Dr. Sarah Johnson - Cardiologist' },
                    { value: 'dr-smith', text: 'Dr. Robert Smith - Interventional Cardiologist' }
                ],
                'neurology': [
                    { value: 'dr-rodriguez', text: 'Dr. Emily Rodriguez - Neurologist' },
                    { value: 'dr-lee', text: 'Dr. David Lee - Neurosurgeon' }
                ],
                'pediatrics': [
                    { value: 'dr-wilson', text: 'Dr. Jennifer Wilson - Pediatrician' },
                    { value: 'dr-brown', text: 'Dr. Michael Brown - Pediatric Specialist' }
                ],
                'orthopedics': [
                    { value: 'dr-davis', text: 'Dr. Christopher Davis - Orthopedic Surgeon' },
                    { value: 'dr-miller', text: 'Dr. Amanda Miller - Sports Medicine' }
                ],
                'ophthalmology': [
                    { value: 'dr-taylor', text: 'Dr. Lisa Taylor - Ophthalmologist' },
                    { value: 'dr-anderson', text: 'Dr. Kevin Anderson - Retinal Specialist' }
                ],
                'pulmonology': [
                    { value: 'dr-thomas', text: 'Dr. Rachel Thomas - Pulmonologist' },
                    { value: 'dr-white', text: 'Dr. Daniel White - Sleep Medicine' }
                ]
            };

            departmentSelect.addEventListener('change', function() {
                const selectedDepartment = this.value;
                const doctors = doctorsByDepartment[selectedDepartment] || [];
                
                // Clear current options except first one
                doctorSelect.innerHTML = '<option value="">Any Available Doctor</option>';
                
                // Add department-specific doctors
                doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.value;
                    option.textContent = doctor.text;
                    doctorSelect.appendChild(option);
                });
            });
        }

        // Time slot availability simulation
        const appointmentDate = document.getElementById('appointmentDate');
        const appointmentTime = document.getElementById('appointmentTime');
        
        if (appointmentDate && appointmentTime) {
            appointmentDate.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const dayOfWeek = selectedDate.getDay();
                
                // Clear current options
                appointmentTime.innerHTML = '<option value="">Select Time</option>';
                
                // Weekend has limited hours
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    const weekendTimes = [
                        { value: '09:00', text: '9:00 AM' },
                        { value: '10:00', text: '10:00 AM' },
                        { value: '11:00', text: '11:00 AM' },
                        { value: '14:00', text: '2:00 PM' },
                        { value: '15:00', text: '3:00 PM' }
                    ];
                    
                    weekendTimes.forEach(time => {
                        const option = document.createElement('option');
                        option.value = time.value;
                        option.textContent = time.text;
                        appointmentTime.appendChild(option);
                    });
                } else {
                    // Weekday hours
                    const weekdayTimes = [
                        { value: '08:00', text: '8:00 AM' },
                        { value: '09:00', text: '9:00 AM' },
                        { value: '10:00', text: '10:00 AM' },
                        { value: '11:00', text: '11:00 AM' },
                        { value: '14:00', text: '2:00 PM' },
                        { value: '15:00', text: '3:00 PM' },
                        { value: '16:00', text: '4:00 PM' },
                        { value: '17:00', text: '5:00 PM' }
                    ];
                    
                    weekdayTimes.forEach(time => {
                        const option = document.createElement('option');
                        option.value = time.value;
                        option.textContent = time.text;
                        appointmentTime.appendChild(option);
                    });
                }
            });
        }

        // Terms checkbox validation
        const termsCheckbox = appointmentForm.querySelector('input[name="terms"]');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', function() {
                const checkboxGroup = this.closest('.checkbox-group');
                if (this.checked) {
                    checkboxGroup.style.color = '';
                }
            });
        }
    }

    // Info items animation
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });

    // Form sections animation
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease-out ${index * 0.3}s, transform 0.6s ease-out ${index * 0.3}s`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 500 + (index * 300));
    });

    console.log('Appointment page functionality loaded successfully!');
});