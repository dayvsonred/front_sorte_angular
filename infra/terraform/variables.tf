variable "aws_region" {
  type        = string
  description = "AWS region for S3 bucket."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Name used to build resource names."
  default     = "front-sorte-doacao"
}

variable "bucket_name" {
  type        = string
  description = "S3 bucket name for the Angular build."
  default     = "thepuregracev1"
}

variable "price_class" {
  type        = string
  description = "CloudFront price class."
  default     = "PriceClass_100"
}

variable "hosted_zone_id" {
  type        = string
  description = "Route 53 hosted zone ID."
  default     = "Z05352952IWQJNXHJAN9G"
}

variable "domain_name" {
  type        = string
  description = "Root domain for the site."
  default     = "thepuregrace.com"
}

variable "www_domain_name" {
  type        = string
  description = "WWW domain for the site."
  default     = "www.thepuregrace.com"
}
