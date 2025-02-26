"use client";
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className=''>
            <div className='bg-slate-500 h-40 flex items-center justify-center'>
                <h1 className='text-center text-white text-4xl'>Privacy Policy</h1>
            </div>
            <div className='container mx-auto p-5'>
                <p className='mb-6 text-lg'>At our non-profit book app, we take your privacy seriously. Here’s a quick overview of how we handle your information:</p>
                <ol className='space-y-6'>
                    <li>
                        <div className='text-xl font-bold mb-2'>Data Collection</div>
                        <p className='text-lg'>We collect your email, and optionally, your name, birthday, and profile picture. This information helps us personalize your experience and is never shared with third parties.</p>
                    </li>
                    <li>
                        <div className='text-xl font-bold mb-2'>App Usage Data</div>
                        <p className='text-lg'>We store your app usage data (such as favorite books, collections, and reviews) securely in the cloud to improve your experience and enhance app features.</p>
                        <p className='text-lg'>The Application does not gather precise information about the location of your mobile device.</p>
                    </li>
                    <li>
                        <div className='text-xl font-bold mb-2'>Data Sharing</div>
                        <p className='text-lg'>We do not share your personal data with any third parties. The only data sharing is with our cloud service provider, which securely stores your information to ensure the app functions properly.</p>
                        <p className='text-lg'>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p>
                    </li>
                    <li>
                        <div className='text-xl font-bold mb-2'>Optional Notifications</div>
                        <p className='text-lg'>You have the option to receive notifications or newsletters. These are completely optional, and you can choose to opt-out at any time.</p>
                        <p className='text-lg'>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices, and marketing promotions.</p>
                    </li>
                    <li>
                        <div className='text-xl font-bold mb-2'>Data Protection</div>
                        <p className='text-lg'>We make every effort to protect your data using strong security measures through our cloud services. However, please understand that no method of internet communication is 100% secure, and while we strive to protect your privacy, absolute security cannot be guaranteed.</p>
                        <p className='text-lg'>The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p>
                    </li>
                    <li>
                        <div className='text-xl font-bold mb-2'>Age Restrictions</div>
                        <p className='text-lg'>Our app is intended for users aged 13 and older. We encourage parents to protect their children’s privacy by controlling their access to the app and ensuring they are using it safely.</p>
                        <p className='text-lg'>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (Amir19225@outlook.com) so that they will be able to take the necessary actions.</p>
                    </li>
                </ol>
                <p className='mt-6 text-lg'>We are committed to safeguarding your personal data and providing you with a safe and enjoyable app experience. If you have any questions or concerns about this privacy policy, feel free to contact us at Amir19225@outlook.com. Your trust is important to us, and we’ll continue to work hard to earn it.</p>
                <p className='mt-6 text-lg'>This privacy policy is effective as of 2025-02-25. By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;