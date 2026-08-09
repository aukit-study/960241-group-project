document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                id: Date.now(),
                title: document.getElementById('title').value,
                role: document.getElementById('role').value,
                type: document.getElementById('type').value,
                description: document.getElementById('description').value,
                target_audience: document.getElementById('target_audience').value,
                problem_solved: document.getElementById('problem_solved').value,
                what_i_learned: document.getElementById('what_i_learned').value,
                tech_stack: document.getElementById('tech_stack').value,
                github_url: document.getElementById('github_url').value,
                is_visible: document.getElementById('is_visible').checked,
                is_favorite: document.getElementById('is_favorite').checked
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
                    method: 'POST',
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('🎉 บันทึกผลงานสำเร็จ!');
                    projectForm.reset();
                } else {
                    alert('❌ เกิดข้อผิดพลาดในการบันทึก');
                }
            } catch (error) {
                alert('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้');
            }
        });
    }

    const activityForm = document.getElementById('activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                id: Date.now(),
                title: document.getElementById('act_title').value,
                role: document.getElementById('act_role').value,
                description: document.getElementById('act_description').value,
                image_url: document.getElementById('act_image_url').value,
                is_visible: document.getElementById('act_is_visible').checked
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
                    method: 'POST',
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('🎉 บันทึกกิจกรรมสำเร็จ!');
                    activityForm.reset();
                } else {
                    alert('❌ เกิดข้อผิดพลาดในการบันทึกกิจกรรม');
                }
            } catch (error) {
                alert('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้');
            }
        });
    }
});
