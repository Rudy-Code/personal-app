function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
	return <div className={`container mx-auto max-w-6xl md:px-8 md:py-10 ${className}`}>{children}</div>
}

export default Container
