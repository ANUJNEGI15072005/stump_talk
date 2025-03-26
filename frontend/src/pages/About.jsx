import { FaLinkedin, FaGithub } from "react-icons/fa";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white p-6">
            <div className="max-w-2xl text-center">
                <p className="text-lg text-gray-300 leading-relaxed">
                    This project is a <span className="font-bold text-white">full-stack authentication system</span> built with
                    <span className="font-bold text-white">React (Frontend)</span> and <span className="font-bold text-white">Express (Backend)</span>. It allows users to <span className="font-bold text-white">sign up, log in,</span> and
                    access <span className="font-bold text-white">protected routes</span> seamlessly.
                    The UI is designed with <span className="font-bold text-white">Tailwind CSS</span>, making it <span className="font-bold text-white">fully responsive</span> on all devices.
                </p>

                <h2 className="text-2xl font-bold mt-6 mb-2 text-white"> Developed By</h2>
                <p className="text-lg text-gray-400">
                    This project was created by <span className="font-extrabold text-green-400">Anuj Negi</span>,
                    a passionate <span className="font-bold text-white">Mern Stack Developer</span> with expertise in <span className="font-bold text-white">React, Tailwind CSS, and Express.js</span>.
                </p>

                <h2 className="text-2xl font-bold mt-6 mb-2 text-white"> Connect with Anuj</h2>
                <div className="flex justify-center space-x-4 mt-3">
                    <a
                        href="https://www.linkedin.com/in/anuj-negi-b78910320/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 p-3 rounded-full text-white text-2xl hover:bg-blue-600 transition"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/ANUJNEGI15072005"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 p-3 rounded-full text-white text-2xl hover:bg-gray-700 transition"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
