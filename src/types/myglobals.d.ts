declare global {
	interface Window {
		grecaptcha: ReCaptchaInstance
		captchaOnLoad: () => void
	};

	interface ReCaptchaInstance {
		ready: (cb: () => any) => void;
		execute: (key: string, options: ReCaptchaExecuteOptions) => Promise<string>;
		render: (id: string, options: ReCaptchaRenderOptions) => any;
	};

	interface ReCaptchaExecuteOptions {
		action: string;
	};

	interface ReCaptchaRenderOptions {
		sitekey: string;
		size: 'invisible';
	};

	var _mongoClientPromise: Promise<MongoClient>
	var hcaptcha
}

export { };
